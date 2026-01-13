type PicklistOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type MultiPicklistProps = {
  id?: string;
  label: string;
  options: PicklistOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  forcedValues?: string[];
};

export default function MultiPicklist({ id, label, options, value, onChange, disabled = false, forcedValues = [] }: MultiPicklistProps) {

  let isForced = (val: string) => forcedValues.includes(val);

  // Toggle a single option in the array
  let toggleValue = (val: string) => {
    if (isForced(val)) return;

    if (value.includes(val)) {
      // Remove it if already selected
      onChange(value.filter(v => v !== val));
    } else {
      // Add it if not selected
      onChange([...value, val]);
    }
  };

  return (
    <div className="picklist-wrapper" style={{ marginBottom: "20px" }}>
      <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{label}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {options.map(opt => (
          <label key={opt.value} style={{ display: "flex", alignItems: "center", cursor: disabled ? "not-allowed" : "pointer" }}>
            <div>
              <input
                type="checkbox"
                value={opt.value}
                checked={value.includes(opt.value) || isForced(opt.value)}
                onChange={() => toggleValue(opt.value)}
                disabled={disabled || opt.disabled || isForced(opt.value)} // disable individual options or whole list
                style={{ marginRight: "8px" }}
              />
            </div>
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
