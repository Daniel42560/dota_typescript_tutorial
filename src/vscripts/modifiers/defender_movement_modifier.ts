import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class defender_movement_modifier extends BaseModifier{
    
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }    
    CheckState() {
        return {[ModifierState.COMMAND_RESTRICTED]: true,
                [ModifierState.NO_HEALTH_BAR]: true
        }
    } 
}