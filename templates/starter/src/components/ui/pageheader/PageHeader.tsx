type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

const PageHeader = ({ title, subtitle, className = '' }: PageHeaderProps) => {
  return (
    <div className={className}>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {subtitle ? <p className="text-xs text-gray-400">{subtitle}</p> : null}
    </div>
  );
};

export default PageHeader;

