import reactImg from "./React.png";
import pythonImg from "./python.png";
import bootstrap from "./bootstrapMUI copy.png";
import django from "./django.png";
import djangoRest from "./django rest.png";
import htmlCss from "./html css.png";
import javascript from "./js.png";
import nextJs from "./next.js.png";
import numpy from "./numpy.png";
import openCV from "./openCv.png";
import typescript from "./typescript.webp";
import wordpress from "./wordpress.png";
import HTML from "./html.png";

export const imageMap: Array<{ name: string; src: string }> = [
    { name: "React", src: reactImg },
    { name: "Python", src: pythonImg },
    { name: "BootstrapMUI", src: bootstrap },
    { name: "Django", src: django },
    { name: "DjangoRest", src: djangoRest },
    { name: "HTML&CSS", src: htmlCss },
    { name: "HTML", src: HTML },
    { name: "JavaScript", src: javascript },
    { name: "NextJs", src: nextJs },
    { name: "Numpy", src: numpy },
    { name: "TypeScript", src: typescript },
    { name: "WordPress", src: wordpress },
    { name: "OpenCV", src: openCV },
];

export function returnImageSrc({ name }: { name: string }): string {
    const found = imageMap.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    return found ? found.src : "";
}
