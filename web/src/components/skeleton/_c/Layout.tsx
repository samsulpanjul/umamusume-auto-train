interface Props {
  children: React.ReactNode;
}
export default function SkeletonLayout({ children }: Props) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Column({ children }: Props) {
  return (
    <div className="box h-[512px] max-h-[750px] border-border overflow-y-auto">
      {children}
    </div>
  );
}

SkeletonLayout.Column = Column;
