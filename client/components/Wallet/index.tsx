type IWalletProps = {
  bankName: string;
  iban: string;
  userName: string;
};

export function Wallet({ bankName, iban, userName }: IWalletProps) {
  return (
    <div className="relative  w-full md:w-full h-55 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-400 via-blue-600 to-black opacity-90" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
      <img src="/P.png" alt="" className="absolute h-8 right-3 top-4" />
      <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-black/10 to-blue-600 blur opacity-40" />

      <div className="relative z-2 h-full w-full p-6 flex flex-col justify-between text-white">
        <div className="flex  ">
          <span className="text-lg font-semibold tracking-wide">
            {bankName}
          </span>
        </div>

        <span className="flex md:flex-row flex-col gap-4 items-center justify-between">
          <div className="relative w-10 h-14 rotate-90 rounded-md bg-linear-to-br from-yellow-200 to-yellow-500 shadow-inner overflow-hidden">
            <span className="absolute left-1/2 top-0 h-full w-px bg-yellow-800/40" />
            <span className="absolute left-1 top-0 h-full w-px bg-yellow-800/30" />
            <span className="absolute right-1 top-0 h-full w-px bg-yellow-800/30" />
            <span className="absolute top-1/3 left-0 w-full h-px bg-yellow-800/40" />
            <span className="absolute bottom-1/3 left-0 w-full h-px bg-yellow-800/30" />
            <span className="absolute inset-0 bg-white/10" />
          </div>

          <p className="font-semibold text-xl  tracking-widest">
            {iban.replace(/(.{4})/g, "$1 ")}
          </p>
        </span>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs uppercase opacity-70">Titular</p>
            <p className="font-medium text-sm tracking-wide mt-1">{userName}</p>
          </div>

          <span className="text-sm opacity-80">Cartão</span>
        </div>
      </div>
    </div>
  );
}
