export type Topic = {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  active: boolean;
};

export type TopicHistory = {
  topic_id: string;
  used_on: string;
}; 