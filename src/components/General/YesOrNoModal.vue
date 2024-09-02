<template>
    <div class="modal-overlay">
        <div class="Modal primary modal-content framed">
            <div class="modal-header">
                <h2 class="modal-text">{{ title }}</h2>
                <span class="close" @click="handleClose">&times;</span>
            </div>
            <div class="modal-body">
                <h3 class="modal-text">{{ message }}</h3>
                <div class="modal-actions">
                    <button class="btn btn-yes" @click="handleYes">Yes</button>
                    <button class="btn btn-no" @click="handleClose">No</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: 'Confirmation'
        },
        message: {
            type: String,
            default: 'Are you sure?'
        }
    },
    methods: {
        handleYes() {
            this.$emit('yes');
        },
        handleClose() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
* {
    font-family: Pokemon GB;
}

.modal-overlay {
    position: fixed;
    z-index: 6;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.Modal {
    position: absolute;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 30vw;
    color:black;
    background-color: white;
}
.modal-text{
    font-weight: 100;
}
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.modal-header h2 {
    margin: 0;
}

.modal-header .close {
    font-size: 20px;
    cursor: pointer;
}

.modal-body {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.modal-body h3 {
    margin: 0;
    line-height: 1.4em;
}

.modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 20px;
}

.modal-body button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: black;
    border-radius: 5px;
    cursor: pointer;
}

.btn-yes {
    background-color: #4CAF50;
    color: white;
}

.btn-no {
    background-color: #f44336;
    color: white;
}

.btn-yes:hover,
.btn-no:hover {
    opacity: 0.8;
}
</style>
