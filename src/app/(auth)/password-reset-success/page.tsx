"use client";

import Image from "next/image";
import { Body } from "@/components/atoms/Typography";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Button from "@/components/atoms/Button";

const PasswordResetSuccessPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica futura para envío de código
  };

  return (
    <div className="min-h-screen w-full  relative">
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
            Tu contraseña ha sido restablecida exitosamente.
          </Body>

          <Button type="submit" variant="primary" className="mx-auto">
            Inicio de sesión
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetSuccessPage;
