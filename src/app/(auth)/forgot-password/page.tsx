"use client";

import Image from "next/image";
import { Body } from "@/components/atoms/Typography/index";
import Button from "@/components/atoms/Button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const ForgotPasswordPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full relative">
      <div className="absolute top-15 left-20">
        <Image
          src="/images/logotipo-base.svg"
          alt="Rata Cueva Logo"
          width={180}
          height={60}
          className="w-[120px] sm:w-[150px] md:w-[180px] h-auto"
        />
      </div>
      <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-12 lg:px-20 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="flex justify-center items-center pt-5">
            <ArrowPathIcon
              className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] md:w-[214px] md:h-[214px] aspect-square"
              aria-label="Restart icon"
            />
          </div>
          <Body className="text-center w-full max-w-lg px-2.5 sm:px-0 text-text">
            Haz clic en el botón para solicitar un código de restablecimiento,
            posteriormente introdúcelo en el formulario de la siguiente interfaz
          </Body>
          <Button type="submit" variant="primary" className="mx-auto">
            Solicitar código de restablecimiento
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
