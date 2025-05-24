import Image from "next/image";

const Profile = () => {
  return (
    <section className="h-[80vh] flex items-center justify-center px-6 bg-white dark:dark:bg-black">
      <div className="flex flex-col md:flex-row w-full max-w-[1200px] mx-auto items-center gap-8">
        {/* Left Text Block */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
            Hi <span className="inline-block">👋</span>,<br />
            My name is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500">
              Zahid Farooq{" "}
            </span>
            <br />I build things for web
          </h1>
        </div>

        {/* Right Profile Image */}
        <div className="w-full md:w-1/2 flex justify-end">
          <div className="relative w-52 h-52 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 p-1">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 p-1">
              <Image
                src="/images/my-image.png"
                alt="Zahid "
                fill
                className="rounded-full object-cover"
                style={{ position: "" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
