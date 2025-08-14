export type User = {
    email: string,
    username: string,
    lastName: string
    avatar?: string
}
export type CategoryIcon = {
    id: number,
    name: string,
    keywords: string,
    svg?: string
}

export type TransactionType = "expense" | 'income' | 'transfer' | 'adjustment' | '';

export type CategoryBudget = {
    id: number,
    date: string,
    amount: number,
    category: number
}

export type CategoryExpense = {
    categoryId: number,
    categoryTitle: string,
    totalExpense: number,
}


export type TransactionCategory = {
    type: TransactionType,
    id: number,
    name: string,
    iconId: number,
    colorId: number
}


export type Transaction = {
    id: number,
    date: string,
    amount: number,
    title: string,
    spender: number | null,
    category: number | null,
    account: number,
    transfer_account: number | null,
    type: TransactionType,
    work: boolean
}

export type TransactionImport = {
    date: string,
    amount: number,
    title: string,
}

export type TransactionsFilters = {
    category: number | null,
    rangeDate: Date [] | null,
    minAmount: number | null,
    maxAmount: number | null,
    account: number | null
}

export const transactionTypes = [
    {
        label: 'Despesa',
        value: 'expense'
    },
    {
        label: 'Receita',
        value: 'income'
    },
    {
        label: 'Transferência',
        value: 'transfer'
    }
]


export type FamilyMember = {
    id: number,
    name: string,
    default: boolean
}


export type BarChartTransactionData = {
    month: string,
    expense: number,
    income: number
}

export type QuestionType = 'satisfaction' | 'values' | 'other';


export type CategoryAssessment = {
    id: number,
    categoryId: number,
    questionType: QuestionType,
    date: string,
    assessment: number
}

export type SortOptions = 'amount' | 'date' | 'title' | 'category' | 'id' | 'spender' | 'type' | 'account';
export type DatesOptions = 'month' | 'last-30-days' | 'week' | 'day' | 'personalized';



export type Account = {
    id: number,
    title: string,
    default: boolean,
    bank_logo: number,
    type: 'credit' | 'debt',
    closing_day: number | null
}


export type WorkingTime = {
    time: number,
    family_member: number,
    id: number
  }

export type GoalTransaction = {
    id: number;
    goal_id: number;
    amount: number;
    created_at: string;
};

export type GoalStatus = 'active' | 'stopped' | 'completed'
export type Goal = {
    id: number,
    name: string;
    cost: number;
    term: string;
    image: number;
    status: GoalStatus
    transactions: GoalTransaction[];
};
  

export type Question = {
    id: number,
    question: string,
    type: number
}