import { PANEL_CLASS } from "@/lib/ui-classes";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export default function Panel({ children, className }: PanelProps) {
  const classes = className ? `${PANEL_CLASS} ${className}` : PANEL_CLASS;

  return <section className={classes}>{children}</section>;
}
