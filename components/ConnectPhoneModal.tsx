"use client"

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { X, Send } from 'lucide-react'

interface Props {
    isOpen: boolean
    onClose: () => void
}

export default function ConnectPhoneModal({ isOpen, onClose }: Props) {
    // Bot username ni o'zgartiring
    const BOT_USERNAME = "EnwisAuthBot" 

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-slate-900">
                                        Telefon raqamni tasdiqlash
                                    </Dialog.Title>
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <div className="mt-2 space-y-4">
                                    <p className="text-sm text-slate-500">
                                        Eng oson va tekin yo'li — Telegram bot orqali tasdiqlash. 
                                        Bu orqali sizning Telegram ID'ingiz ham avtomatik ulanadi.
                                    </p>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                                            <li>Pastdagi tugmani bosing.</li>
                                            <li>Telegram ochiladi va <b>"Start"</b> ni bosing.</li>
                                            <li><b>"Telefon raqamni tasdiqlash"</b> tugmasini bosing.</li>
                                            <li>Bo'ldi! Saytga qaytib sahifani yangilang.</li>
                                        </ol>
                                    </div>

                                    <a 
                                        href={`https://t.me/${BOT_USERNAME}?start=verify`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-12 bg-[#229ED9] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1e8cc2] transition-colors shadow-lg shadow-blue-400/30"
                                    >
                                        <Send size={18} /> Telegram orqali tasdiqlash
                                    </a>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}