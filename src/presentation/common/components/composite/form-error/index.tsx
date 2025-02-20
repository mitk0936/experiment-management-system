export function FormError({ message }: { message: string | undefined }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-red-500 text-sm mt-0.5" role="alert" aria-live="assertive">
      {message}
    </p>
  );
}
