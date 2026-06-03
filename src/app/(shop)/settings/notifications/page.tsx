"use client"

import { PageLayout } from "@/components/templates/PageLayout"
import { CheckIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { Body, BodySmall, Subheading } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb";

export default function NotificationsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    orders: false,
    promotions: false,
    newsletter: false,
    security: false,
  });
  const [pushNotifications, setPushNotifications] = useState({
    orders: false,
    promotions: false,
    chat: false,
    updates: false,
  });

  const updateEmailSetting = (key: string) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const updatePushSetting = (key: string) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Configuración", href: "/settings" },
            { label: "Notificaciones" },
          ]}
          title="Notificaciones"
          color="text-white"
          className="mb-8"
        />
        <div className="space-y-6">
          <div className="p-6 bg-gray rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Subheading className="text-white font-bold">Notificaciones por email</Subheading>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Body className="text-white font-medium">Estado de pedidos</Body>
                  <BodySmall className="text-placeholder text-sm">Actualizaciones sobre tus compras</BodySmall>
                </div>
                <button
                  onClick={() => updateEmailSetting('orders')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications.orders ? 'bg-primary' : 'bg-dark'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications.orders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Body className="text-white font-medium">Promociones y ofertas</Body>
                  <BodySmall className="text-placeholder text-sm">Descuentos y productos especiales</BodySmall>
                </div>
                <button
                  onClick={() => updateEmailSetting('promotions')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications.promotions ? 'bg-primary' : 'bg-dark'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications.promotions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Body className="text-white font-medium">Newsletter</Body>
                  <BodySmall className="text-placeholder text-sm">Noticias y contenido relevante</BodySmall>
                </div>
                <button
                  onClick={() => updateEmailSetting('newsletter')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications.newsletter ? 'bg-primary' : 'bg-dark'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications.newsletter ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Body className="text-white font-medium">Alertas de seguridad</Body>
                  <BodySmall className="text-placeholder text-sm">Notificaciones importantes de tu cuenta</BodySmall>
                </div>
                <button
                  onClick={() => updateEmailSetting('security')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications.security ? 'bg-primary' : 'bg-dark'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications.security ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Subheading className="text-white font-bold">Notificaciones push</Subheading>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Body className="text-white font-medium">Estado de pedidos</Body>
                  <BodySmall className="text-placeholder text-sm">Actualizaciones en tiempo real</BodySmall>
                </div>
                <button
                  onClick={() => updatePushSetting('orders')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pushNotifications.orders ? 'bg-primary' : 'bg-dark'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotifications.orders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Body className="text-white font-medium">Promociones</Body>
                  <BodySmall className="text-placeholder text-sm">Ofertas especiales y descuentos</BodySmall>
                </div>
                <button
                  onClick={() => updatePushSetting('promotions')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pushNotifications.promotions ? 'bg-primary' : 'bg-dark'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotifications.promotions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Body className="text-white font-medium">Chat y soporte</Body>
                  <BodySmall className="text-placeholder text-sm">Mensajes del equipo de soporte</BodySmall>
                </div>
                <button
                  onClick={() => updatePushSetting('chat')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pushNotifications.chat ? 'bg-primary' : 'bg-dark'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotifications.chat ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Body className="text-white font-medium">Actualizaciones de la app</Body>
                  <BodySmall className="text-placeholder text-sm">Nuevas funciones y mejoras</BodySmall>
                </div>
                <button
                  onClick={() => updatePushSetting('updates')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pushNotifications.updates ? 'bg-primary' : 'bg-dark'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pushNotifications.updates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button><CheckIcon className="w-5 h-5 mr-2" />Guardar cambios</Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}