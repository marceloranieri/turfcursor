-- Create a stored procedure for giving a genius award
-- This ensures that the transaction is atomic
CREATE OR REPLACE FUNCTION award_genius(
  p_message_id UUID,
  p_from_user_id UUID,
  p_to_user_id UUID
) RETURNS VOID AS $$
DECLARE
  v_from_user_remaining INTEGER;
BEGIN
  -- Start a transaction
  BEGIN
    -- Check if the sender has enough genius awards remaining
    SELECT genius_awards_remaining INTO v_from_user_remaining
    FROM users
    WHERE id = p_from_user_id;
    
    IF v_from_user_remaining <= 0 THEN
      RAISE EXCEPTION 'Not enough genius awards remaining';
    END IF;
    
    -- Decrement the sender's remaining genius awards
    UPDATE users
    SET genius_awards_remaining = genius_awards_remaining - 1
    WHERE id = p_from_user_id;
    
    -- Increment the recipient's received genius awards
    UPDATE users
    SET 
      genius_awards_received = genius_awards_received + 1,
      harmony_points = harmony_points + 10, -- Award bonus harmony points
      is_debate_maestro = CASE 
        WHEN genius_awards_received + 1 >= 10 THEN TRUE 
        ELSE is_debate_maestro 
      END
    WHERE id = p_to_user_id;
    
    -- Create a notification for the recipient
    INSERT INTO notifications (
      user_id, 
      content, 
      type, 
      is_read, 
      created_at, 
      related_id
    ) VALUES (
      p_to_user_id, 
      'You received a Genius Award!', 
      'genius_award', 
      FALSE, 
      NOW(), 
      p_message_id
    );
    
    -- Add a special reaction to the message
    INSERT INTO reactions (
      message_id,
      user_id,
      type,
      content,
      created_at
    ) VALUES (
      p_message_id,
      p_from_user_id,
      'genius',
      '🧠', -- Genius emoji
      NOW()
    )
    ON CONFLICT (message_id, user_id, type) DO NOTHING;
    
  -- End the transaction
  EXCEPTION WHEN OTHERS THEN
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql; 