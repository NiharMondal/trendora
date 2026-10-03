import Container from "@/shared/components/container";
import AuthNavbar from "@/features/auth/components/auth-navbar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <AuthNavbar />
            <Container>{children}</Container>
        </section>
    );
}
