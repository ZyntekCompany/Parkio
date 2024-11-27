import { WrapperHeader } from "@/components/auth/wrapper-header";

interface FormWrapperProps {
  children?: React.ReactNode;
  headerTitle: string;
  headerSubtitle?: string;
}

export function FormWrapper({
  children,
  headerTitle,
  headerSubtitle,
}: FormWrapperProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-full sm:max-w-[500px] xs:px-6 px-4 overflow-hidden">
      <WrapperHeader title={headerTitle} subtitle={headerSubtitle} />

      <div className="w-full mt-3">{children}</div>
    </div>
  );
}
