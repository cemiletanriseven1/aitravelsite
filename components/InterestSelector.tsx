interface Props {
    value: string[];
    onChange: (val: string[]) => void;
}

const INTERESTS = ["Tarih", "Doğa", "Alışveriş", "Müze", "Park", "Yemek"];

export default function InterestSelector({ value, onChange }: Props) {
    function toggle(tag: string) {
        if (value.includes(tag)) {
            onChange(value.filter((v) => v !== tag));
        } else {
            onChange([...value, tag]);
        }
    }

    return (
        <div>
            <label className="font-semibold">İlgi Alanları</label>
            <div className="mt-2 flex flex-wrap gap-2">
                {INTERESTS.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => toggle(tag)}
                        className={`px-3 py-2 rounded border ${value.includes(tag)
                                ? "bg-blue-600 text-white"
                                : "bg-white text-black"
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
}
