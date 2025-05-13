-- Daily Topics Schema Migration

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT FALSE
);

-- Create index for faster queries on active status
CREATE INDEX IF NOT EXISTS idx_topics_active ON topics (active);

-- Ensure topic titles are unique
ALTER TABLE topics ADD CONSTRAINT IF NOT EXISTS unique_title UNIQUE (title);

-- Create topic history table to track usage
CREATE TABLE IF NOT EXISTS topic_history (
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  used_on DATE DEFAULT CURRENT_DATE,
  PRIMARY KEY (topic_id, used_on)
);

-- Create seed topics (20 sample topics to get started)
INSERT INTO topics (title, description, category) 
VALUES
  ('Universal Basic Income', 'Should governments provide a universal basic income to all citizens?', 'Economics'),
  ('Space Exploration', 'Is space exploration worth the investment?', 'Science'),
  ('AI Regulation', 'How much regulation should be placed on artificial intelligence?', 'Technology'),
  ('Remote Work', 'Is remote work better for society than traditional office work?', 'Workplace'),
  ('Mandatory Voting', 'Should voting be mandatory for all eligible citizens?', 'Politics'),
  ('Social Media Impact', 'Do social media platforms do more harm than good?', 'Technology'),
  ('Climate Change Solutions', 'What's the most effective approach to combat climate change?', 'Environment'),
  ('Free College Education', 'Should college education be free for all?', 'Education'),
  ('Cryptocurrency Future', 'Will cryptocurrencies replace traditional banking?', 'Finance'),
  ('Genetic Modification', 'Should genetic modification of humans be permitted?', 'Ethics'),
  ('Cancel Culture', 'Is cancel culture beneficial or harmful to society?', 'Society'),
  ('Nuclear Energy', 'Is nuclear energy the solution to climate change?', 'Environment'),
  ('Minimum Wage', 'Should the minimum wage be increased significantly?', 'Economics'),
  ('Vegetarianism', 'Is a vegetarian diet better for the planet?', 'Food'),
  ('Privacy vs Security', 'How should we balance privacy and security in digital surveillance?', 'Technology'),
  ('Healthcare Systems', 'Which healthcare system is most effective: private, public, or hybrid?', 'Health'),
  ('Modern Art', 'What defines value in modern art?', 'Arts'),
  ('Wealth Tax', 'Should the ultra-wealthy pay a higher percentage in taxes?', 'Economics'),
  ('Urban vs Rural', 'Is urban living superior to rural living?', 'Lifestyle'),
  ('Automation Impact', 'How will automation impact jobs in the next decade?', 'Technology')
ON CONFLICT (title) DO NOTHING; 