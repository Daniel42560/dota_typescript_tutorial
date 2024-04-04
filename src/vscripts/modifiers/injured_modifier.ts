import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class injured_modifier extends BaseModifier{

    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }    
    DeclareFunctions(): ModifierFunction[] {
		return [ModifierFunction.TRANSLATE_ACTIVITY_MODIFIERS
        ];
	}
    GetActivityTranslationModifiers(): string {        
        return "injured"
    }    
}