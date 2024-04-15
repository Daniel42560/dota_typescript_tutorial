import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class row_2_modifier extends BaseModifier{
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }    
}