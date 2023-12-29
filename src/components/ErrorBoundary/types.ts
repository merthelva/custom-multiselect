type TErrorBoundaryProps = React.PropsWithChildren<{
  fallback: React.ReactNode;
}>;
type TErrorBoundaryState = { hasError: boolean };

export type { TErrorBoundaryState, TErrorBoundaryProps };
