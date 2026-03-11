interface Book {
    title: string;
    description?: string;
    badge?: {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
    }[];
}