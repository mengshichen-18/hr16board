import Link from 'next/link';

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            <p className="text-sm">
                <Link
                    href="https://www.sjtu.edu.cn"
                    className="decoration-dashed text-primary underline-offset-8"
                >
                    今天天气不错
                </Link>
            </p>
        </footer>
    );
}
