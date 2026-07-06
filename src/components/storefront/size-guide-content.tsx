const SIZES = [
  {
    label: "Küçük (S)",
    height: "15 - 20 cm",
    note: "Anahtarlıklar, parmak kuklalar ve mini peluşlar",
  },
  {
    label: "Orta (M)",
    height: "25 - 35 cm",
    note: "Standart peluş oyuncaklar ve uyku arkadaşları",
  },
  {
    label: "Büyük (L)",
    height: "40 - 55 cm",
    note: "Kucaklama peluşları ve dekoratif yastıklar",
  },
];

export function SizeGuideContent() {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Elena peluş oyuncakları üç boy seçeneğinde sunulur. Her ürün
        sayfasında o ürüne özel boy bilgisini bulabilirsiniz — aşağıdaki
        tablo genel bir referans niteliğindedir.
      </p>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground">Boy</th>
              <th className="px-4 py-3 font-medium text-foreground">
                Yükseklik
              </th>
              <th className="px-4 py-3 font-medium text-foreground">
                Uygun Ürünler
              </th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map((size, i) => (
              <tr
                key={size.label}
                className={i % 2 === 1 ? "bg-secondary/40" : undefined}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {size.label}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {size.height}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {size.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Ölçümler elle yapıldığından ±2 cm fark gösterebilir.
      </p>
    </div>
  );
}
