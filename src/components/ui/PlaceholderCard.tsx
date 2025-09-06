import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PlaceholderCard({ title, description, children }: PlaceholderCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children || (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p>Content coming soon...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
