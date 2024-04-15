import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class attack_range_modifier extends BaseModifier{
    

    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }    
    DeclareFunctions(): ModifierFunction[] {
		return [ModifierFunction.ATTACK_RANGE_BASE_OVERRIDE,
                ModifierFunction.ATTACKSPEED_BASE_OVERRIDE
        ];
	}
    GetModifierAttackRangeOverride(): number {
        return 6000;
    }
    GetModifierAttackSpeedBaseOverride(): number {
        return 1;
    }
}