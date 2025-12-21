import districts from "@/data/districts.json";

interface Props {
    city: string;
    value: string;
    onChange: (val: string) => void;
}

export default function DistrictSelector({ city, value, onChange }: Props) {
    const list = districts[city] || [];

    return (
        <div>
            <label className="font-semibold">İlçe</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full mt-1 border p-2 rounded"
            >
                <option value="">Seçiniz</option>
                {list.map((d, i) => (
                    <option key={i} value={d}>
                        {d}
                    </option>
                ))}
            </select>
        </div>
    );
}
