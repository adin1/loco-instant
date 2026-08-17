import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, MessageSquare, Lock, AlertCircle, RefreshCw, Send, Star, Sparkles } from 'lucide-react';
import { OrderItem } from '../types';

interface OrdersAndEscrowDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
  onReleaseEscrow: (orderId: string) => void;
  onSendMessage: (orderId: string, text: string) => void;
  onWriteReviewForOrder?: (order: OrderItem) => void;
}

export const OrdersAndEscrowDrawer: React.FC<OrdersAndEscrowDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onReleaseEscrow,
  onSendMessage,
  onWriteReviewForOrder
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'in_desfasurare' | 'platita'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'in_desfasurare') return o.status === 'in_desfasurare' || o.status === 'acceptata';
    if (activeTab === 'platita') return o.status === 'platita' || o.status === 'finalizata';
    return true;
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedOrder) return;
    onSendMessage(selectedOrder.id, chatInput);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end p-2 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm text-slate-900">
                Comenzile Mele & Portofel Escrow
              </h2>
              <p className="text-[11px] text-slate-500">
                Plăți securizate și protecție 100% pentru clienți și meșteri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="p-3 bg-white border-b border-slate-100 flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toate Comenzile ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('in_desfasurare')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'in_desfasurare'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            În Desfășurare / Active
          </button>
          <button
            onClick={() => setActiveTab('platita')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'platita'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Finalizate & Plătite
          </button>
        </div>

        {/* Content Body Split */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Order List Column */}
          <div className="p-3 space-y-2 overflow-y-auto max-h-[300px] md:max-h-none">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">Nicio comandă găsită.</p>
            ) : (
              filteredOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {ord.id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          ord.status === 'platita' || ord.status === 'finalizata'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status === 'in_desfasurare' ? 'În Desfășurare' : 'Finalizată'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <img
                        src={ord.providerImage}
                        alt={ord.providerName}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{ord.providerName}</h4>
                        <p className="text-[10px] text-slate-500">{ord.serviceName}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="font-black text-slate-900">{ord.amount} RON</span>
                      <span className="text-[10px] text-slate-400">{ord.date}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Order Detail & Chat Column */}
          {selectedOrder ? (
            <div className="p-4 flex flex-col justify-between bg-slate-50/50 space-y-4">
              <div className="space-y-3">
                {/* Order Escrow Protection Banner */}
                <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Garanție Escrow Protejată</span>
                    </span>
                    <span className="font-black">{selectedOrder.amount} RON</span>
                  </div>
                  <p className="text-[10px] text-emerald-100 leading-snug">
                    {selectedOrder.escrowStatus === 'securizat'
                      ? 'Banii sunt blocați în siguranță. Bifează eliberarea fondurilor doar după ce lucrarea este finalizată cu succes!'
                      : 'Fondurile au fost eliberate către prestator.'}
                  </p>
                </div>

                {/* Release Escrow CTA */}
                {selectedOrder.escrowStatus === 'securizat' && (
                  <button
                    onClick={() => onReleaseEscrow(selectedOrder.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Execuția & Eliberează Banii ({selectedOrder.amount} RON)</span>
                  </button>
                )}

                {/* Review CTA for Paid/Completed Orders */}
                {(selectedOrder.escrowStatus === 'eliberat' || selectedOrder.status === 'platita' || selectedOrder.status === 'finalizata') && (
                  <div className="pt-1">
                    {selectedOrder.hasReview ? (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex items-center justify-center space-x-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Recenzie Trimisă (+25 Puncte Loco Revendicate)</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onWriteReviewForOrder && onWriteReviewForOrder(selectedOrder)}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 animate-pulse"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        <span>Evaluează Prestatorul & Câștigă +25 Puncte Loco</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Chat History Messages */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Mesaje & Conversație Directă
                  </span>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 h-44 overflow-y-auto space-y-2 text-xs">
                    {selectedOrder.chatHistory.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          m.sender === 'client' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-2.5 rounded-2xl text-xs ${
                            m.sender === 'client'
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : 'bg-slate-100 text-slate-800 rounded-bl-none'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[9px] text-slate-400 px-1 mt-0.5">{m.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scrie un mesaj prestatorului..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-semibold bg-white rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center">
              Selectează o comandă pentru a vedea detaliile
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
