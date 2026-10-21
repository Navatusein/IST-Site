export interface IDiffPart {
  value: string;
  type: "same" | "added" | "removed";
}

const MAX_CELLS = 4_000_000;

export function diffWords(before: string, after: string): IDiffPart[] {
  const a = before.split(/(\s+)/).filter(Boolean);
  const b = after.split(/(\s+)/).filter(Boolean);

  if (a.length * b.length > MAX_CELLS)
    return [
      ...(before ? [{value: before, type: "removed" as const}] : []),
      ...(after ? [{value: after, type: "added" as const}] : [])
    ];

  const lengths = Array.from({length: a.length + 1}, () => new Uint32Array(b.length + 1));

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--)
      lengths[i][j] = a[i] == b[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
  }

  const parts: IDiffPart[] = [];
  const push = (value: string, type: IDiffPart["type"]) => {
    const last = parts.at(-1);

    if (last?.type == type)
      last.value += value;
    else
      parts.push({value, type});
  }

  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] == b[j]) {
      push(a[i], "same");
      i++;
      j++;
    }
    else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      push(a[i++], "removed");
    }
    else {
      push(b[j++], "added");
    }
  }

  while (i < a.length)
    push(a[i++], "removed");

  while (j < b.length)
    push(b[j++], "added");

  return parts;
}
