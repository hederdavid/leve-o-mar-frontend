<script setup lang="ts">
import { ref } from 'vue'
import type { User, SavedAddress } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import {
  MapPin,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Building,
  Home
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface Props {
  user: User
}

const props = defineProps<Props>()
const authStore = useAuthStore()

const isAddingNew = ref(false)
const newLabel = ref('')
const newCep = ref('')
const newStreet = ref('')
const newNumber = ref('')
const newComplement = ref('')
const newNeighborhood = ref('')
const newCity = ref('')
const newState = ref('')

function handleAddAddress() {
  if (!newStreet.value || !newNumber.value || !newCity.value) {
    toast.error('Preencha os campos obrigatórios do endereço.')
    return
  }

  const newAddress: SavedAddress = {
    id: `addr-${Date.now()}`,
    label: newLabel.value || 'Novo Endereço',
    isDefault: props.user.addresses.length === 0,
    cep: newCep.value || '00000-000',
    street: newStreet.value,
    number: newNumber.value,
    complement: newComplement.value,
    neighborhood: newNeighborhood.value || 'Bairro',
    city: newCity.value,
    state: newState.value || 'UF'
  }

  authStore.updateProfile({
    addresses: [...props.user.addresses, newAddress]
  })

  isAddingNew.value = false
  newLabel.value = ''
  newCep.value = ''
  newStreet.value = ''
  newNumber.value = ''
  newComplement.value = ''
  newNeighborhood.value = ''
  newCity.value = ''
  newState.value = ''
}

function setDefaultAddress(id: string) {
  const updated = props.user.addresses.map((a) => ({
    ...a,
    isDefault: a.id === id
  }))
  authStore.updateProfile({ addresses: updated })
}

function removeAddress(id: string) {
  const updated = props.user.addresses.filter((a) => a.id !== id)
  authStore.updateProfile({ addresses: updated })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E1D6] pb-4">
      <div>
        <h1 class="text-2xl font-serif font-bold text-[#0A2B42]">Endereços & Entrega Segura</h1>
        <p class="text-xs text-[#5A738E] mt-1">
          Locais cadastrados para recebimento de cargas frágeis com seguro de vidro marítimo.
        </p>
      </div>

      <button
        v-if="!isAddingNew"
        type="button"
        class="px-4 py-2.5 rounded-xl bg-[#0A2B42] text-white text-xs font-semibold hover:bg-[#144272] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        @click="isAddingNew = true"
      >
        <Plus :size="15" />
        <span>Adicionar Endereço</span>
      </button>
    </div>

    <div v-if="isAddingNew" class="p-6 bg-white border border-[#E6E1D6] rounded-3xl shadow-sm space-y-4">
      <h2 class="text-base font-serif font-bold text-[#0A2B42]">Novo Endereço de Recebimento</h2>

      <form class="space-y-3" @submit.prevent="handleAddAddress">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-[#5A738E] mb-1">Identificação</label>
            <input
              v-model="newLabel"
              type="text"
              placeholder="Ex: Minha Casa, Trabalho, Casa de Praia"
              class="w-full px-3 py-2 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-xs text-[#0A2B42] focus:outline-none focus:border-[#0A2B42]"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-[#5A738E] mb-1">CEP</label>
            <input
              v-model="newCep"
              type="text"
              placeholder="00000-000"
              class="w-full px-3 py-2 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-xs text-[#0A2B42] focus:outline-none focus:border-[#0A2B42]"
            />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="col-span-2">
            <label class="block text-[11px] font-bold uppercase tracking-wider text-[#5A738E] mb-1">Logradouro / Rua</label>
            <input
              v-model="newStreet"
              type="text"
              required
              placeholder="Rua, Avenida, Alameda"
              class="w-full px-3 py-2 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-xs text-[#0A2B42] focus:outline-none focus:border-[#0A2B42]"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-[#5A738E] mb-1">Número</label>
            <input
              v-model="newNumber"
              type="text"
              required
              placeholder="123"
              class="w-full px-3 py-2 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-xs text-[#0A2B42] focus:outline-none focus:border-[#0A2B42]"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-[#5A738E] mb-1">Complemento</label>
            <input
              v-model="newComplement"
              type="text"
              placeholder="Apto, Bloco (opcional)"
              class="w-full px-3 py-2 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-xs text-[#0A2B42] focus:outline-none focus:border-[#0A2B42]"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-[#5A738E] mb-1">Cidade</label>
            <input
              v-model="newCity"
              type="text"
              required
              placeholder="Cidade"
              class="w-full px-3 py-2 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-xs text-[#0A2B42] focus:outline-none focus:border-[#0A2B42]"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-[#5A738E] mb-1">Estado</label>
            <input
              v-model="newState"
              type="text"
              required
              placeholder="UF (ex: BA)"
              class="w-full px-3 py-2 bg-[#FBF9F5] border border-[#D9D3C7] rounded-xl text-xs text-[#0A2B42] focus:outline-none focus:border-[#0A2B42]"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-[#5A738E] hover:bg-[#F7F4EE] transition-colors cursor-pointer"
            @click="isAddingNew = false"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl bg-[#0A2B42] text-white text-xs font-semibold hover:bg-[#144272] transition-colors cursor-pointer"
          >
            Salvar Endereço
          </button>
        </div>
      </form>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="address in user.addresses"
        :key="address.id"
        class="p-5 bg-white border rounded-3xl shadow-sm space-y-3 transition-all"
        :class="address.isDefault ? 'border-[#0A2B42] ring-1 ring-[#0A2B42]/10' : 'border-[#E6E1D6]'"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Home :size="16" class="text-[#0A2B42]" />
            <h3 class="text-sm font-bold text-[#0A2B42]">{{ address.label }}</h3>
          </div>

          <span
            v-if="address.isDefault"
            class="px-2 py-0.5 rounded-full bg-[#0A2B42] text-white text-[10px] font-bold"
          >
            Principal
          </span>
        </div>

        <div class="text-xs text-[#4F6D7A] leading-relaxed">
          <p class="font-medium text-[#0A2B42]">{{ address.street }}, {{ address.number }} {{ address.complement ? `· ${address.complement}` : '' }}</p>
          <p>{{ address.neighborhood }} · {{ address.city }} - {{ address.state }}</p>
          <p class="font-mono text-[#5A738E] mt-1">CEP: {{ address.cep }}</p>
        </div>

        <div class="pt-3 border-t border-[#F0EDE4] flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-[11px] text-[#05BFDB] font-semibold">
            <ShieldCheck :size="14" />
            <span>Seguro Vidro Habilitado</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="!address.isDefault"
              type="button"
              class="text-xs font-semibold text-[#0A2B42] hover:underline cursor-pointer"
              @click="setDefaultAddress(address.id)"
            >
              Definir Principal
            </button>
            <button
              v-if="user.addresses.length > 1"
              type="button"
              aria-label="Remover endereço"
              class="p-1.5 rounded text-[#8A9BA8] hover:text-[#E86A58] transition-colors cursor-pointer"
              @click="removeAddress(address.id)"
            >
              <Trash2 :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
