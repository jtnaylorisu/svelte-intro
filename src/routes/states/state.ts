export interface StateData {
    error: boolean;
    msg: string;
    data: Country;
}

export interface Country {
    name: string;
    iso3: string;
    iso2: string;
    states: State[];
}

export interface State {
    name: string;
    state_code: string;
}