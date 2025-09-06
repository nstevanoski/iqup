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
          <div className="text-center py-8 text-gray-500">
            <p>This page is under development.</p>
            <p className="text-sm mt-2">Content will be added here soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
