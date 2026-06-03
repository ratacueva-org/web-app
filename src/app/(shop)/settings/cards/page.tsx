"use client"

import { PageLayout } from "@/components/templates/PageLayout"
import { CreditCardIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb";
import { Body, Subheading } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button"
import { getPaymentMethods, deletePaymentMethod, PaymentMethod } from "@/services/settings/card"
import { useAuth } from "@/contexts/AuthContext"
import AddCardModal from "@/components/features/settings/atoms/AddCardModal"

export default function CardsPage() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch payment methods on component mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        setError("");
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error: unknown) {
        console.error('Error fetching payment methods:', error);
        setError("Error al cargar las tarjetas");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const handleDeleteCard = async (id: string) => {
    try {
      setDeleting(id);
      setError("");
      setSuccess("");
      
      await deletePaymentMethod(id);
      setPaymentMethods(prev => prev.filter(method => method._id !== id));
      setSuccess("Tarjeta eliminada correctamente");
    } catch (error: unknown) {
      console.error('Error deleting payment method:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error.response as { data?: { message?: string } })?.data?.message || "Error al eliminar la tarjeta"
        : "Error al eliminar la tarjeta";
      setError(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  const handleAddCardSuccess = () => {
    // Refresh the payment methods list
    const fetchPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        setPaymentMethods(methods);
        setSuccess("Tarjeta agregada correctamente");
      } catch (error: unknown) {
        console.error('Error fetching payment methods:', error);
      }
    };
    fetchPaymentMethods();
  };

  const getCardTypeDisplay = (type: string) => {
    switch (type) {
      case "credit_card":
        return "Tarjeta de Crédito";
      case "debit_card":
        return "Tarjeta de Débito";
      case "paypal":
        return "PayPal";
      case "oxxo_cash":
        return "OXXO";
      default:
        return type;
    }
  };



  if (loading) {
    return (
      <PageLayout>
        <div className="pt-8 pb-4">
          <SettingsBreadcrumb
            items={[
              { label: "Configuración", href: "/settings" },
              { label: "Tarjetas" },
            ]}
            title="Tarjetas"
            color="text-white"
            className="mb-8"
          />
          <div className="space-y-6">
            <div className="text-white text-center">Cargando tarjetas...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Configuración", href: "/settings" },
            { label: "Tarjetas" },
          ]}
          title="Tarjetas"
          color="text-white"
          className="mb-8"
        />
        
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <Body className="text-red-400">{error}</Body>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg">
            <Body className="text-green-400">{success}</Body>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-12">
                <CreditCardIcon className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <Body className="text-white mb-2">No tienes tarjetas guardadas</Body>
                <Body className="text-zinc-400">Agrega una tarjeta para realizar compras más rápido</Body>
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div key={method._id} className="p-6 bg-gray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 relative bg-white rounded-[99px] flex items-center justify-center flex-shrink-0">
                        <CreditCardIcon className="w-8 h-8 text-gray" />
                      </div>
                      <div>
                        <Subheading className="text-white font-medium">
                          {getCardTypeDisplay(method.type)}
                        </Subheading>
                        <Body className="text-placeholder text-sm">{method.provider || 'N/A'}</Body>
                        <Body className="text-placeholder text-sm">
                          {method.last4 && `Terminada en ${method.last4}`}
                          {method.expiration && (
                            <span className="ml-2">
                              Vencimiento: {method.expiration}
                            </span>
                          )}
                        </Body>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch gap-2">
                      <Button 
                        className="min-w-[160px]" 
                        onClick={() => handleDeleteCard(method._id)}
                        disabled={deleting === method._id}
                      >
                        <TrashIcon className="w-5 h-5 mr-2" />
                        {deleting === method._id ? "Eliminando..." : "Eliminar"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add New Card Button */}
        <div className="flex justify-end pt-8">
          <Button 
            className="flex items-center gap-2"
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon className="w-5 h-5" />
            Agregar nueva tarjeta
          </Button>
        </div>

        {/* Add Card Modal */}
        <AddCardModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddCardSuccess}
        />
      </div>
    </PageLayout>
  )
}