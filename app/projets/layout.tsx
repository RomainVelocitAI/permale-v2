import AuthWrapper from '@/components/AuthWrapper'

export default function ProjetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthWrapper>{children}</AuthWrapper>
}