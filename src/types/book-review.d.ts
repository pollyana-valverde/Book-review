interface BookReview {
  id: string;
  title: string;
  author: string;
  description?: string;
  badge?: {
    label: string;
    variant: "fantasy" | "fiction" | "romance" | "non-fiction" | "sci-fi";
  }[];
  rating: number;
}
