import { useState, useEffect } from 'react';

export default function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [customs, setCustoms] = useState([]);
  const [size, setSize] = useState('M');
  const [total, setTotal] = useState(0);
  const [menuType, setMenuType] = useState('drink');
  const [showCustomize, setShowCustomize] = useState(false);
  const [cart, setCart] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // --- ドリンクメニュー ---
  const drinkMenu = {
    '季節のおすすめ': [
      { name: 'ストロベリーフラッペ', price: 678, img: '/images/strawberryfrappe.png', fixedSize: true },
      { name: 'マンゴーオレ', price: 590, img: '/images/mango.png', fixedSize: true },
      { name: 'チョコムースラテ', price: 600, img: '/images/chocolate.png', fixedSize: true },
    ],
    コーヒー: [
      { name: 'ホットコーヒー', price: 450, img: '/images/hotcoffee.png' },
      { name: 'アイスコーヒー', price: 450, img: '/images/icecoffee.png' },
      { name: 'カフェオレ', price: 560, img: '/images/cafeaulait.png' },
      { name: 'アメリカーノ', price: 500, img: '/images/americano.png' },
    ],
    エスプレッソ: [
      { name: 'カフェラテ', price: 520, img: '/images/cafelatte.png' },
      { name: 'キャラメルマキアート', price: 590, img: '/images/caramelmacchiato.png' },
      { name: 'ホワイトモカ', price: 590, img: '/images/whitemocha.png' },
    ],
    フラッペ: [
      { name: 'モカフラッペ', price: 620, img: '/images/mochafrappe.png' },
      { name: 'キャラメルフラッペ', price: 610, img: '/images/caramelfrappe.png' },
      { name: '抹茶フラッペ', price: 620, img: '/images/matchafrappe.png' },
    ],
    ティー: [
      { name: '抹茶ラテ', price: 580, img: '/images/matchalatte.png' },
      { name: 'アイスティー', price: 480, img: '/images/icetea.png' },
      { name: 'ほうじ茶ラテ', price: 580, img: '/images/houjilatte.png' },
    ],
  };

  // --- フードメニュー ---
  const foodMenu = {
    スイーツ: [
      { name: '低糖質チーズケーキ', price: 480, img: '/images/cheesecake.png' },
      { name: 'ドーナツ', price: 280, img: '/images/donut.png' },
      { name: 'チョコスコーン', price: 310, img: '/images/scones.png' },
    ],
    軽食: [
      { name: 'サラダラップ', price: 460, img: '/images/saladwrap.png' },
      { name: 'BLTチーズバーガー', price: 590, img: '/images/hamburger.png' },
      { name: 'ほうれん草とベーコンのキッシュ', price: 480, img: '/images/quiche.png' },
    ],
  };

  const menu = menuType === 'drink' ? drinkMenu : foodMenu;

  const customizeOptions = [
    { label: '低脂肪タイプ / 無脂肪乳', price: 0 },
    { label: '豆乳 / アーモンドミルク / オーツミルク (+¥55)', price: 55 },
    { label: 'エスプレッソショット追加 (+¥55)', price: 55 },
    { label: 'ホイップクリーム追加 (+¥55)', price: 55 },
    { label: 'チョコチップ追加 (+¥55)', price: 55 },
    { label: 'シトラス果肉 (+¥110)', price: 110 },
  ];

  // --- 操作関数 ---
  const handleSelect = (item) => {
    setSelectedItem(item);
    setTotal(item.price);
    setCustoms([]);
    setSize('M');
    setShowCustomize(false);
  };

  const toggleCustom = (option) => {
    if (customs.includes(option.label)) {
      setCustoms(customs.filter((c) => c !== option.label));
      setTotal((prev) => prev - option.price);
    } else {
      setCustoms([...customs, option.label]);
      setTotal((prev) => prev + option.price);
    }
  };

  const handleSizeChange = (s) => {
    setSize(s);
    if (selectedItem) {
      let sizePrice = s === 'S' ? -50 : s === 'L' ? 50 : 0;
      let customsTotal = customs.reduce((sum, c) => {
        const opt = customizeOptions.find((o) => o.label === c);
        return sum + (opt ? opt.price : 0);
      }, 0);
      setTotal(selectedItem.price + sizePrice + customsTotal);
    }
  };

  const addToCart = () => {
    if (!selectedItem) return;
    const newItem = {
      name: selectedItem.name,
      size,
      customs: [...customs],
      price: total,
      quantity: 1,
    };
    setCart([...cart, newItem]);
    setSelectedItem(null);
    setShowCustomize(false);
  };

  const updateQuantity = (index, delta) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].quantity += delta;
      if (newCart[index].quantity < 1) newCart[index].quantity = 1;
      return newCart;
    });
  };

  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        cart.map((i) => `${i.name} ${i.size} ¥${i.price} × ${i.quantity}`).join('\n')
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('コピーできませんでした。手動でコピーしてください。');
    }
  };

  const handleConfirmOrder = () => setShowConfirm(true);
  const handleCompleteOrder = () => {
    setShowConfirm(false);
    setShowComplete(true);
  };
  const handleRestart = () => {
    setCart([]);
    setSelectedItem(null);
    setCustoms([]);
    setSize('M');
    setTotal(0);
    setMenuType('drink');
    setShowConfirm(false);
    setShowComplete(false);
  };

  // --- スタイル ---
  const greenButton = {
    backgroundColor: '#00704A',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
    fontFamily: "'Roboto', sans-serif",
    margin: '5px',
  };

  const optionButton = (active) => ({
    padding: '10px 20px',
    margin: '6px 5px',
    cursor: 'pointer',
    borderRadius: '20px',
    border: '2px solid #00704A',
    backgroundColor: active ? '#00704A' : '#fff',
    color: active ? 'white' : 'black',
    fontWeight: 'bold',
    fontFamily: "'Roboto', sans-serif",
    fontSize: '16px',
    transition: '0.2s',
  });

  // --- 注文完了画面 ---
  if (showComplete) {
    return (
      <div
        style={{
          maxWidth: '400px',
          margin: '40px auto',
          backgroundColor: 'white',
          borderRadius: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          padding: '25px',
          fontFamily: "'Roboto', sans-serif",
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: '#00704A', fontFamily: "'Playfair Display', serif" }}>☕ ご注文が確定しました！</h2>
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          {cart.map((item, index) => (
            <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
              <strong>{item.name}</strong>（{item.size}）
              {item.customs.length > 0 && <div style={{ fontSize: '0.9rem' }}>{item.customs.join('、')}</div>}
              <div>¥{item.price} × {item.quantity} = ¥{item.price * item.quantity}</div>
            </div>
          ))}
        </div>
        <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
          合計: ¥{cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}
        </p>
        <button style={greenButton} onClick={handleCopy}>注文内容をコピー</button>
        {copied && <p style={{ color: 'green' }}>コピーしました！</p>}
        <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#555' }}>
          実験を終了します。注文内容をコピーして元のサイトに貼り付けてください。
        </p>
        <button style={{ ...greenButton, marginTop: '15px' }} onClick={handleRestart}>トップに戻る</button>
      </div>
    );
  }

  // --- 通常画面レンダリング ---
  return (
    <div style={{ padding: '10px', fontFamily: "'Roboto', sans-serif", maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px', fontFamily: "'Playfair Display', serif", color: '#00704A', fontSize: '1.8rem' }}>
        Star Mobile Order
      </h1>

      {/* メニュー切替 */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <button style={optionButton(menuType === 'drink')} onClick={() => setMenuType('drink')}>ドリンク</button>
        <button style={optionButton(menuType === 'food')} onClick={() => setMenuType('food')}>フード</button>
      </div>

      {/* メニュー表示 */}
      {Object.entries(menu).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#00704A', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.2rem' }}>{category}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {items.map(item => (
              <div key={item.name} onClick={() => handleSelect(item)}
                style={{ cursor: 'pointer', border: '1px solid #ddd', borderRadius: '15px', padding: '10px', textAlign: 'center', width: '120px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                <img src={item.img} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
                <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</p>
                <p style={{ fontSize: '0.85rem' }}>¥{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 商品選択モーダル */}
      {selectedItem && (
        <div style={{
          position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '90%', maxWidth: '350px', maxHeight: '80%', overflowY: 'auto',
          backgroundColor: 'white', padding: '20px', borderRadius: '25px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: 1000
        }}>
          <button onClick={() => setSelectedItem(null)}
            style={{ position: 'absolute', top: '10px', right: '15px', background: 'transparent', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', color: '#555' }}>×</button>

          <h3 style={{ textAlign: 'center', marginBottom: '10px', fontFamily: "'Playfair Display', serif", color: '#00704A', fontSize: '1.2rem' }}>{selectedItem.name}</h3>

          {menuType === 'drink' && !selectedItem.fixedSize && (
            <>
              <p>サイズ:</p>
              {['S', 'M', 'L'].map(s => <button key={s} style={optionButton(size === s)} onClick={() => handleSizeChange(s)}>{s}</button>)}
            </>
          )}
          {menuType === 'drink' && selectedItem.fixedSize && <p>サイズ: M（固定）</p>}

          {menuType === 'drink' && (
            <>
              {!showCustomize ? (
                <button style={greenButton} onClick={() => setShowCustomize(true)}>カスタマイズする</button>
              ) : (
                <>
                  <p>カスタマイズ:</p>
                  {customizeOptions.map(option => (
                    <button key={option.label} style={optionButton(customs.includes(option.label))} onClick={() => toggleCustom(option)}>
                      {option.label}{customs.includes(option.label) ? ' ✓' : ''}
                    </button>
                  ))}
                  <button style={{ ...greenButton, backgroundColor: '#aaa', marginTop: '10px' }} onClick={() => setShowCustomize(false)}>閉じる</button>
                </>
              )}
            </>
          )}

          <p style={{ fontWeight: 'bold', margin: '10px 0' }}>合計: ¥{total}</p>
          <button style={greenButton} onClick={addToCart}>カートに入れる</button>
        </div>
      )}

      {/* カートエリア */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#f9f9f9',
        borderTop: '3px solid #00704A',
        padding: '15px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.15)',
        borderRadius: '20px 20px 0 0',
        marginTop: '30px'
      }}>
        <h3 style={{ color: '#00704A', marginBottom: '8px' }}>🛒 カート</h3>
        {cart.length === 0 ? <p>カートは空です</p> :
          <>
            {cart.map((item, index) => (
              <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{item.name}</strong> ({item.size})
                  {item.customs.length > 0 && <div style={{ fontSize: '0.85rem' }}>{item.customs.join('、')}</div>}
                  <div>¥{item.price} × {item.quantity} = ¥{item.price * item.quantity}</div>
                </div>
                <div>
                  <button style={{ ...greenButton, padding: '5px 10px', margin: '2px' }} onClick={() => updateQuantity(index, 1)}>+</button>
                  <button style={{ ...greenButton, padding: '5px 10px', margin: '2px' }} onClick={() => updateQuantity(index, -1)}>-</button>
                  <button style={{ ...greenButton, backgroundColor: '#c00', padding: '5px 10px', margin: '2px' }} onClick={() => removeItem(index)}>削除</button>
                </div>
              </div>
            ))}
            <p style={{ fontWeight: 'bold', marginTop: 5 }}>合計: ¥{cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}</p>
            <button style={greenButton} onClick={handleConfirmOrder}>注文に進む</button>
          </>
        }
      </div>

      {/* 注文確認モーダル */}
      {showConfirm && (
        <div style={{
          position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '90%', maxWidth: '400px', maxHeight: '80%', overflowY: 'auto',
          backgroundColor: 'white', padding: '20px', borderRadius: '25px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: 1000
        }}>
          <h3 style={{ color: '#00704A', fontFamily: "'Playfair Display', serif" }}>注文内容の確認</h3>
          {cart.map((item, index) => (
            <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '5px 0' }}>
              <strong>{item.name}</strong> ({item.size})
              {item.customs.length > 0 && <div style={{ fontSize: '0.85rem' }}>{item.customs.join('、')}</div>}
              <div>¥{item.price} × {item.quantity} = ¥{item.price * item.quantity}</div>
            </div>
          ))}
          <p style={{ fontWeight: 'bold', marginTop: '10px' }}>
            合計: ¥{cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}
          </p>
          <button style={greenButton} onClick={handleCompleteOrder}>注文を確定する</button>
          <button style={{ ...greenButton, backgroundColor: '#aaa' }} onClick={() => setShowConfirm(false)}>キャンセル</button>
        </div>
      )}
    </div>
  );
}
