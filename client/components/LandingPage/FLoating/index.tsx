export function FloatingLanguageImages() {
 const langs = [
   // TOP LEFT
   {
     src: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
     className: "top-26 lg:left-40  left-10",
     title: "JavaScript",
   },

   // TOP RIGHT
   {
     src: "https://www.citypng.com/public/uploads/preview/hd-java-logo-transparent-background-701751694771845zainlxmlfo.png",
     className: "top-26 lg:right-46 right-10",
     title: "Java",
   },

   // MIDDLE LEFT (bordas, não centro)
   {
     src: "https://www.citypng.com/public/uploads/preview/hd-python-logo-symbol-transparent-png-735811696257415dbkifcuokn.png",
     className: "top-[45%] left-8",
     title: "Python",
   },

   // MIDDLE RIGHT
   {
     src: "https://pngimg.com/uploads/php/php_PNG35.png",
     className: "top-[50%] right-10",
     title: "PHP",
   },

   // BOTTOM LEFT
   {
     src: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png",
     className: "bottom-16 left-20",
     title: "C#",
   },

   // BOTTOM RIGHT
   {
     src: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
     className: "bottom-10 right-24",
     title: "JavaScript",
   },
 ];

  return (
    <div className="absolute hidden md:flex inset-0 w-full  justify-center items-center  place-self-center pointer-events-none">
      {langs.map((lang, i) => (
        <div
          key={i}
          className={`
            absolute ${lang.className}
            animate-pulse
            bg-background/70 backdrop-blur
            border 
            p-3 shadow-md flex items-center gap-4 scale-90
            rounded-full
          `}
        >
          <img
            src={lang.src}
            alt="language icon"
            className="w-8 h-8 "
          />
          <p className="text-sm">{lang?.title}</p>
        </div>
      ))}
    </div>
  );
}
