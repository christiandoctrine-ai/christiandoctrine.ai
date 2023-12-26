import { useState } from 'react';

const Slider = ({ setSourceNumber }: { setSourceNumber: any }) => {
  const [value, setValue] = useState(2);

  let lsvalue: any;
  if (typeof window !== 'undefined') {
    lsvalue = localStorage.getItem('sourceNumber');
  }
  const handleChange = (event: any) => {
    setSourceNumber(event.target.value);
    setValue(event.target.value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sourceNumber', event.target.value);
    }
  };

  const calculateBackground = () => {
    const percentage = ((lsvalue - 1) / 5) * 100;
    return `linear-gradient(to right, #6366F1 0%, #6366F1 ${percentage}%, #1F2937 ${percentage}%, #1F2937 100%)`;
  };

  return (
    <div className="my-5" style={{ display: 'none' }}>
      <label className="text-xs sm:text-sm font-semibold leading-6 text-blue-400">
        Sources Number
      </label>
      <div>
        <input
          type="range"
          min="1"
          max={value}
          step="1"
          value={lsvalue}
          onChange={handleChange}
          style={{
            background: calculateBackground(),
            height: '8px',
            outline: 'none',
            WebkitAppearance: 'none',
            appearance: 'none',
            borderRadius: '5px',
            width: '100%',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '5px',
            color: 'white',
          }}
        >
          {Array.from({ length: 6 }, (_, index) => index + 1).map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </div>
      <style jsx>
        {`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background-color: #6366f1;
            border: 2px solid #1f2937;
            border-radius: 50%;
            cursor: pointer;
          }

          input[type='range']::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background-color: #6366f1;
            border: 2px solid #1f2937;
            border-radius: 50%;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default Slider;
