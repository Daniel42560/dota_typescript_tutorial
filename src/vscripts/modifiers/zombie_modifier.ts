import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
import { injured_modifier } from "./injured_modifier";

@registerModifier()
export class zombie_modifier extends BaseModifier{

    death_proc_count?: number = 10;
    injured_proc_count?: number = 5;

    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    OnStackCountChanged(stackCount: number): void {
        if(!IsServer()) return;
        if(this.GetStackCount() == this.injured_proc_count && !this.GetParent().HasModifier("injured-modifier")){
           this.GetParent().AddNewModifier(this.GetParent(), undefined, injured_modifier.name, undefined)
        }
        if(this.GetStackCount() <= stackCount) return;
        if(this.GetStackCount() < this.death_proc_count!) return;

        //this.SetStackCount(0);
        this.GetParent().ForceKill(false);
    }
    CheckState() { 
        return {[ModifierState.NO_HEALTH_BAR]: true}
    }

    DeclareFunctions(): ModifierFunction[] {
		return [ModifierFunction.TOOLTIP,
                ModifierFunction.ON_ATTACKED,
                ModifierFunction.AVOID_DAMAGE,
                ModifierFunction.MOVESPEED_ABSOLUTE
        ];
	}
    GetModifierAvoidDamage(event: ModifierAttackEvent): number {
        return 100;
    }
    GetModifierMoveSpeed_Absolute(): number {
        return 100;
    }
	OnTooltip(): number {
		return this.death_proc_count!;
	}
    OnAttacked(event: ModifierAttackEvent): void {
        if(!event.target.HasModifier("zombie_modifier")) return;
        this.IncrementStackCount();
    }
}