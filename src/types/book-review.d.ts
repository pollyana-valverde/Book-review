interface BookReview {
  title: string;
  author: string;
  description?: string;
  badge?: {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "ghost"
      | "link";
  }[];
  rating: number;
}
