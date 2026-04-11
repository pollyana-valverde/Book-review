import { RefAttributes, ForwardRefExoticComponent } from "react";
import { LucideProps } from "lucide-react";

import { Text } from "@/components/ui/text";
import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResumeCardProps {
  resume: {
    total: number;
    label: string;
    iconComponent: {
      icon: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >;
      color?: string;
    };
  };
}

function ResumeCard({ resume }: ResumeCardProps) {
  return (
    <Card>
      <CardHeader className="flex gap-3">
        <CardAction
          className={cn(
            " rounded-xl py-2 px-2.5 my-auto",
            resume.iconComponent.color
          )}
        >
          <resume.iconComponent.icon className="w-5.5 h-5.5" />
        </CardAction>

        <CardTitle className="flex flex-col w-full">
          <Text as="h1" variant="heading-1">
            {resume.total}
          </Text>
          <Text
            as="p"
            variant="content-1"
            className="text-muted-foreground font-normal"
          >
            {resume.label}
          </Text>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export { ResumeCard };
