type BranchIdGetter = () => string | null | undefined;

let branchIdGetter: BranchIdGetter | null = null;

export function setBranchIdGetter(getter: BranchIdGetter | null) {
  branchIdGetter = getter;
}

export function getBranchId(): string | null | undefined {
  return branchIdGetter?.() ?? null;
}
