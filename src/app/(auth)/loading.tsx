import SpinnerLoading from "@/shared/components/loading/spinner-loading";

// `/login` awaits `getServerSession` before rendering.
export default function AuthLoading() {
    return <SpinnerLoading className="py-32" />;
}
