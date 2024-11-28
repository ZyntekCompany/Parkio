import { Logo } from "../common/logo";

interface WrapperHeaderProps {
  title: string;
  subtitle?: string;
}

export function WrapperHeader({ title, subtitle }: WrapperHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 pt-0">
      <Logo
        name="Parkio"
        dinamicTextColor
        className="md-plus:hidden mb-6 flex flex-col"
      />
      <h3 className="max-md-plus:text-[26px] text-3xl leading-none text-center">
        {title}
      </h3>
      <p className="text-base text-muted-foreground text-center">{subtitle}</p>
    </div>
  );
}
