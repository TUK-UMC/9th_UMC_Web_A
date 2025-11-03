import ChevronIcon from "../../assets/chevron.svg";
import MailIcon from "../../assets/mail.svg";

export default function SignupHeader({
  title,
  onBack,
  showEmail,
  email,
}: {
  title: string;
  onBack: () => void;
  showEmail?: boolean;
  email?: string;
}) {
  return (
    <div className="w-full">
      <div className="relative flex justify-center items-center w-full">
        <button
          className="absolute left-0 text-white cursor-pointer"
          onClick={onBack}
          type="button"
        >
          <img src={ChevronIcon} alt="chevron" className="w-8 h-8" />
        </button>
        <h1 className="text-2xl font-medium">{title}</h1>
      </div>

      {showEmail && email && (
        <div className="mt-3 w-full px-3 py-3 bg-[#1c1c1c] rounded-md text-sm flex items-center gap-2">
          <img src={MailIcon} alt="mail" className="w-6 h-6" />
          <span className="truncate">{email}</span>
        </div>
      )}
    </div>
  );
}
