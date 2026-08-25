import { useState } from 'react';
import { Link, useHashRoute } from '@/router';
import { Navbar } from '@/components/Navbar';
import { tutors } from '@/data/mock';
import { Rating } from '@/components/Rating';
import { useBookings } from '@/booking/BookingContext';
import { usePayments } from '@/payment/PaymentContext';
import { useNotifications } from '@/notifications/NotificationContext';
import { useAuth } from '@/auth/AuthContext';
import { useToast } from '@/components/Toast';
import type { PaymentMethod } from '@/types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  MapPin,
  CreditCard,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
  Wallet,
  Building2,
  ChevronRight,
} from 'lucide-react';

type Step = 'details' | 'payment' | 'processing' | 'success' | 'failure';

export function BookingPage({ id }: { id: string }) {
  const { navigate } = useHashRoute();
  const { addBooking } = useBookings();
  const { processPayment } = usePayments();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const { toast } = useToast();
  const tutor = tutors.find((t) => t.id === id);
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [mode, setMode] = useState<'video' | 'in-person'>('video');
  const [step, setStep] = useState<Step>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!tutor) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Tutor not found</h1>
          <Link to="/tutors" className="btn-primary mt-6">Back to tutors</Link>
        </div>
      </div>
    );
  }

  const total = (tutor.hourlyRate * duration) / 60;
  const serviceFee = 2;
  const grandTotal = total + serviceFee;
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const handleConfirmBooking = () => {
    setStep('payment');
  };

  const handlePayment = async () => {
    setStep('processing');
    setErrorMsg('');

    try {
      const booking = addBooking({
        tutorId: tutor.id,
        tutorName: tutor.name,
        tutorAvatar: tutor.avatar,
        studentName: user?.name ?? 'Guest',
        studentAvatar: user?.avatar ?? '',
        subject: tutor.subjects[0],
        date,
        time,
        duration,
        mode,
        price: grandTotal,
      });

      await processPayment({
        bookingId: booking.id,
        studentName: user?.name ?? 'Guest',
        tutorName: tutor.name,
        subject: tutor.subjects[0],
        amount: grandTotal,
        method: paymentMethod,
      });

      addNotification({
        title: 'Booking confirmed',
        description: `Your session with ${tutor.name} on ${date} at ${time} is confirmed.`,
        type: 'booking',
      });

      toast('Booking confirmed successfully!', 'success');
      setStep('success');
    } catch {
      setErrorMsg('Payment could not be processed. Please try again.');
      toast('Payment failed. Please try again.', 'error');
      setStep('failure');
    }
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const isCardValid = paymentMethod !== 'card' || (
    cardNumber.replace(/\s/g, '').length >= 15 &&
    cardName.trim().length > 0 &&
    cardExpiry.length === 5 &&
    cardCvc.length >= 3
  );

  // --- Success screen ---
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="card p-8 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-brand-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Payment successful!</h1>
            <p className="mt-2 text-slate-600">
              Your session with {tutor.name} on {date} at {time} is confirmed.
            </p>
            <div className="mt-6 bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2">
              <div className="flex justify-between"><span className="text-slate-500">Tutor</span><span className="font-medium">{tutor.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Subject</span><span className="font-medium">{tutor.subjects[0]}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-medium">{date}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-medium">{time}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-medium">{duration} min</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Mode</span><span className="font-medium capitalize">{mode}</span></div>
              <div className="flex justify-between pt-2 border-t border-slate-200"><span className="text-slate-500">Total paid</span><span className="font-bold text-brand-700">${grandTotal.toFixed(2)}</span></div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/student/bookings')} className="btn-primary flex-1">View my bookings</button>
              <button onClick={() => navigate('/student/messages')} className="btn-secondary flex-1">Message tutor</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Failure screen ---
  if (step === 'failure') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="card p-8 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Payment failed</h1>
            <p className="mt-2 text-slate-600">{errorMsg || 'Your payment could not be processed. No charge has been made.'}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={() => setStep('payment')} className="btn-primary flex-1">Try again</button>
              <button onClick={() => navigate(`/tutors/${tutor.id}`)} className="btn-secondary flex-1">Back to tutor</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Processing screen ---
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="card p-8 text-center">
            <Loader2 className="w-12 h-12 text-brand-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-xl font-bold text-slate-900">Processing payment...</h1>
            <p className="mt-2 text-slate-500">Securing your booking with {tutor.name}. Please wait.</p>
            <div className="mt-6 bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2">
              <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-bold text-brand-700">${grandTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Method</span><span className="font-medium capitalize">{paymentMethod}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Payment step ---
  if (step === 'payment') {
    const methods: { id: PaymentMethod; label: string; icon: typeof CreditCard; desc: string }[] = [
      { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
      { id: 'paypal', label: 'PayPal', icon: Wallet, desc: 'Pay with your PayPal balance' },
      { id: 'bank', label: 'Bank Transfer', icon: Building2, desc: 'Direct bank payment' },
    ];

    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => setStep('details')} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to booking details
          </button>

          <h1 className="text-2xl font-bold font-display text-slate-900 mb-6">Payment</h1>

          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            <div className="space-y-6">
              {/* Payment method selection */}
              <div className="card p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Select payment method</h2>
                <div className="space-y-3">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        paymentMethod === m.id ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === m.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <m.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">{m.label}</p>
                        <p className="text-xs text-slate-500">{m.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === m.id ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                        {paymentMethod === m.id && <CheckCircle2 className="w-full h-full text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card details form */}
              {paymentMethod === 'card' && (
                <div className="card p-6">
                  <h2 className="font-semibold text-slate-900 mb-4">Card details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Card number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        className="input font-mono"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="label">Name on card</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          className="input font-mono"
                          inputMode="numeric"
                        />
                      </div>
                      <div>
                        <label className="label">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          className="input font-mono"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="card p-6 text-center">
                  <Wallet className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">You will be redirected to PayPal to complete your payment securely.</p>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="card p-6 text-center">
                  <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">You will be redirected to your bank's portal to authorize the transfer.</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <aside>
              <div className="card p-5 sticky top-20">
                <h3 className="font-semibold text-slate-900 mb-4">Booking summary</h3>

                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <img src={tutor.avatar} alt={tutor.name} className="w-12 h-12 rounded-full bg-slate-100" />
                  <div>
                    <p className="font-semibold text-slate-900">{tutor.name}</p>
                    <Rating value={tutor.rating} showValue />
                  </div>
                </div>

                <dl className="py-4 space-y-2.5 text-sm border-b border-slate-100">
                  <div className="flex justify-between"><dt className="text-slate-500">Subject</dt><dd className="font-medium">{tutor.subjects[0]}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Date</dt><dd className="font-medium">{date}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Time</dt><dd className="font-medium">{time}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Duration</dt><dd className="font-medium">{duration} min</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-500">Mode</dt><dd className="font-medium capitalize">{mode}</dd></div>
                </dl>

                <div className="py-4 space-y-2 text-sm border-b border-slate-100">
                  <div className="flex justify-between"><span className="text-slate-500">Session rate</span><span>${total.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Service fee</span><span>${serviceFee.toFixed(2)}</span></div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-brand-700">${grandTotal.toFixed(2)}</span>
                </div>

                <button
                  disabled={!isCardValid}
                  onClick={handlePayment}
                  className="btn-primary w-full mt-5 py-3"
                >
                  <Lock className="w-4 h-4" /> Pay ${grandTotal.toFixed(2)}
                </button>
                <p className="mt-3 text-xs text-slate-400 text-center flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> Payments are encrypted and secure
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // --- Details step (default) ---
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/tutors/${tutor.id}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to tutor
        </Link>

        <h1 className="text-2xl font-bold font-display text-slate-900 mb-6">Book a session with {tutor.name}</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-sm font-medium text-slate-900 hidden sm:inline">Booking details</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-sm font-medium text-slate-400 hidden sm:inline">Payment</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-sm font-medium text-slate-400 hidden sm:inline">Confirmation</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6">
            {/* Date */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-brand-600" /> Select a date</h2>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} className="input" />
            </div>

            {/* Time */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-brand-600" /> Select a time</h2>
              <div className="grid grid-cols-4 gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    disabled={t === '13:00'}
                    className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${
                      time === t ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-slate-300 text-slate-700 disabled:opacity-40 disabled:line-through'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Session duration</h2>
              <div className="grid grid-cols-3 gap-2">
                {[45, 60, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      duration === d ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Session mode</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('video')}
                  className={`p-4 rounded-xl border text-left transition-all ${mode === 'video' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <Video className="w-5 h-5 text-brand-600" />
                  <p className="mt-2 font-medium text-slate-900 text-sm">Video call</p>
                  <p className="text-xs text-slate-500">Online via Skillora</p>
                </button>
                <button
                  onClick={() => setMode('in-person')}
                  className={`p-4 rounded-xl border text-left transition-all ${mode === 'in-person' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <MapPin className="w-5 h-5 text-brand-600" />
                  <p className="mt-2 font-medium text-slate-900 text-sm">In-person</p>
                  <p className="text-xs text-slate-500">{tutor.location}</p>
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside>
            <div className="card p-5 sticky top-20">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <img src={tutor.avatar} alt={tutor.name} className="w-12 h-12 rounded-full bg-slate-100" />
                <div>
                  <p className="font-semibold text-slate-900">{tutor.name}</p>
                  <Rating value={tutor.rating} showValue />
                </div>
              </div>

              <dl className="py-4 space-y-2.5 text-sm border-b border-slate-100">
                <div className="flex justify-between"><dt className="text-slate-500">Date</dt><dd className="font-medium">{date || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Time</dt><dd className="font-medium">{time || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Duration</dt><dd className="font-medium">{duration} min</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Mode</dt><dd className="font-medium capitalize">{mode}</dd></div>
              </dl>

              <div className="py-4 space-y-2 text-sm border-b border-slate-100">
                <div className="flex justify-between"><span className="text-slate-500">Rate</span><span>${tutor.hourlyRate}/hr</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Service fee</span><span>${serviceFee.toFixed(2)}</span></div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-brand-700">${grandTotal.toFixed(2)}</span>
              </div>

              <button
                disabled={!date || !time}
                onClick={handleConfirmBooking}
                className="btn-primary w-full mt-5 py-3"
              >
                Continue to payment <ChevronRight className="w-4 h-4" />
              </button>
              <p className="mt-3 text-xs text-slate-400 text-center">Free cancellation up to 24h before the session.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
