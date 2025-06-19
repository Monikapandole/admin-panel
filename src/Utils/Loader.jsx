export const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width="60"
      height="60"
    >
      <circle fill="red" stroke="red" strokeWidth="10" r="10" cx="40" cy="65">
        <animate
          attributeName="cy"
          calcMode="spline"
          dur="2s"
          values="65;135;65"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.4s"
        />
      </circle>
      <circle fill="red" stroke="red" strokeWidth="10" r="10" cx="100" cy="65">
        <animate
          attributeName="cy"
          calcMode="spline"
          dur="2s"
          values="65;135;65"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-.2s"
        />
      </circle>
      <circle fill="red" stroke="red" strokeWidth="10" r="10" cx="160" cy="65">
        <animate
          attributeName="cy"
          calcMode="spline"
          dur="2s"
          values="65;135;65"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="0s"
        />
      </circle>
    </svg>
  </div>
);
