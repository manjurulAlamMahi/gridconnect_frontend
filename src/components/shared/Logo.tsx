import LogoIcon from "@/assets/Icons/Logo.svg";
const Logo = () => {
  return (
    <div className="flex gap-1 items-center">
      <img src={LogoIcon} alt="GridConnect Logo" />
      <div className="flex flex-col font-semibold leading-5">
        <p className="pl-2">Grid</p>
        <p className="-ml-1">Connect</p>
      </div>
    </div>
  );
};
export default Logo;
