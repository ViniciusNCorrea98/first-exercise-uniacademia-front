import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { getActivities } from '../services/storage';

const coupons = [
  {
    id: 'cupom-1',
    store: 'SportWave',
    title: '10% off em roupas esportivas',
    code: 'SPORT10',
    description: 'Libera ao registrar a sua primeira atividade.',
    goalLabel: 'Meta: 1 atividade concluida',
    isUnlocked: ({ totalActivities }) => totalActivities >= 1,
  },
  {
    id: 'cupom-2',
    store: 'NutriBox',
    title: '15% off em snacks fitness',
    code: 'NUTRI15',
    description: 'Perfeito para quem manteve frequencia na semana.',
    goalLabel: 'Meta: 3 atividades nos ultimos 7 dias',
    isUnlocked: ({ weeklyActivities }) => weeklyActivities >= 3,
  },
  {
    id: 'cupom-3',
    store: 'MoveShoes',
    title: '20% off em tenis de corrida',
    code: 'RUN20',
    description: 'Desconto especial para quem ganha ritmo nos treinos.',
    goalLabel: 'Meta: 120 minutos acumulados',
    isUnlocked: ({ totalDuration }) => totalDuration >= 120,
  },
  {
    id: 'cupom-4',
    store: 'GymFuel',
    title: 'Frete gratis em suplementos',
    code: 'FUELFREE',
    description: 'Recompensa extra para quem bate volume de calorias.',
    goalLabel: 'Meta: 1000 calorias acumuladas',
    isUnlocked: ({ totalCalories }) => totalCalories >= 1000,
  },
];

function Cupons() {
  const { user } = useContext(AuthContext);
  const [metrics, setMetrics] = useState({
    totalActivities: 0,
    weeklyActivities: 0,
    totalDuration: 0,
    totalCalories: 0,
  });

  useEffect(() => {
    if (!user) {
      setMetrics({
        totalActivities: 0,
        weeklyActivities: 0,
        totalDuration: 0,
        totalCalories: 0,
      });
      return;
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userActivities = getActivities().filter(
      (activity) => activity.userId === user.id
    );

    const nextMetrics = userActivities.reduce(
      (accumulator, activity) => {
        const activityDate = new Date(activity.date || activity.createdAt);
        const duration = Number(activity.duration) || 0;
        const calories = Number(activity.calories) || 0;

        return {
          totalActivities: accumulator.totalActivities + 1,
          weeklyActivities:
            accumulator.weeklyActivities +
            (activityDate >= sevenDaysAgo ? 1 : 0),
          totalDuration: accumulator.totalDuration + duration,
          totalCalories: accumulator.totalCalories + calories,
        };
      },
      {
        totalActivities: 0,
        weeklyActivities: 0,
        totalDuration: 0,
        totalCalories: 0,
      }
    );

    setMetrics(nextMetrics);
  }, [user]);

  return (
    <div className="container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px' }}>Cupons</h1>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Complete metas simples de treino para desbloquear cupons ficticios.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="card">
          <p style={{ margin: '0 0 8px', color: '#6b7280' }}>Atividades</p>
          <p style={{ margin: 0, fontSize: '30px', fontWeight: '700' }}>
            {metrics.totalActivities}
          </p>
        </div>
        <div className="card">
          <p style={{ margin: '0 0 8px', color: '#6b7280' }}>Ultimos 7 dias</p>
          <p style={{ margin: 0, fontSize: '30px', fontWeight: '700' }}>
            {metrics.weeklyActivities}
          </p>
        </div>
        <div className="card">
          <p style={{ margin: '0 0 8px', color: '#6b7280' }}>Minutos</p>
          <p style={{ margin: 0, fontSize: '30px', fontWeight: '700' }}>
            {metrics.totalDuration}
          </p>
        </div>
        <div className="card">
          <p style={{ margin: '0 0 8px', color: '#6b7280' }}>Calorias</p>
          <p style={{ margin: 0, fontSize: '30px', fontWeight: '700' }}>
            {metrics.totalCalories}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {coupons.map((coupon) => {
          const unlocked = coupon.isUnlocked(metrics);

          return (
            <div
              key={coupon.id}
              className="card"
              style={{
                opacity: unlocked ? 1 : 0.55,
                borderColor: unlocked ? '#86efac' : '#e5e7eb',
                backgroundColor: unlocked ? '#f0fdf4' : '#ffffff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <strong style={{ color: '#111827' }}>{coupon.store}</strong>
                <span
                  style={{
                    padding: '6px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: '700',
                    backgroundColor: unlocked ? '#15803d' : '#e5e7eb',
                    color: unlocked ? '#ffffff' : '#4b5563',
                  }}
                >
                  {unlocked ? 'ATIVO' : 'BLOQUEADO'}
                </span>
              </div>

              <h2 style={{ margin: '0 0 8px', fontSize: '20px' }}>
                {coupon.title}
              </h2>
              <p style={{ margin: '0 0 8px', color: '#4b5563' }}>
                {coupon.description}
              </p>
              <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: '14px' }}>
                {coupon.goalLabel}
              </p>

              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px dashed #9ca3af',
                  backgroundColor: unlocked ? '#ffffff' : '#f9fafb',
                }}
              >
                <p style={{ margin: '0 0 6px', color: '#6b7280', fontSize: '13px' }}>
                  Codigo do cupom
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    color: unlocked ? '#111827' : '#9ca3af',
                  }}
                >
                  {unlocked ? coupon.code : 'LIBERE A META'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Cupons;
