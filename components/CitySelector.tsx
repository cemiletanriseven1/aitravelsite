interface Props {
    value: string;
    onChange: (val: string) => void;
}

export default function CitySelector({ value, onChange }: Props) {
    return (
        <div>
            <label className="font-semibold">Şehir</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full mt-1 border p-2 rounded"
            >
                <option value="">Seçiniz</option>
                <option value="istanbul">İstanbul</option>
                <option value="ankara">Ankara</option>
            </select>
        </div>
    );
}
