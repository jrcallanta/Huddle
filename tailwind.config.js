/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                orange: {
                    300: "#F79F4E",
                    400: "#EE8E35",
                    500: "#D46F11",
                },
                green: {
                    300: "#62B753",
                    400: "#56A648",
                    500: "#348028",
                },
                purple: {
                    300: "#C37CE4",
                    400: "#B071CE",
                    500: "#914BB1",
                },
                mutegrey: {
                    300: "#959595",
                    400: "#868686",
                    500: "#6a6a6a",
                },
            },

            animation: {
                "spin-ease": "spin 1s ease-in-out infinite",
                "fade-in": "fade 350ms ease-in-out 1 backwards",
                "slide-down": "slide-down 150ms ease-out 1 backwards",
                "slide-up": "slide-up 150ms ease-out 1 backwards",
            },
        },
    },
    plugins: [],
};
