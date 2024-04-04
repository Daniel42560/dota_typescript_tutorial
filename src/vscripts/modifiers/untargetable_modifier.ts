import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class untargetable_modifier extends BaseModifier{

    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }    
    CheckState() {
        return {[ModifierState.UNTARGETABLE]: true}
    } 
}